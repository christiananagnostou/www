---
title: 'Queueing with BullMQ and Redis'
dateCreated: 'Oct 06, 2023'
summary: 'Scaling async tasks with concurrency is scary fast'
hidden: false
categories: 'backend'
---

I recently had to query an API for 2 million users and update some data on each of those users. Seems simple enough, but let's break down what's actually going on here. The problem was that I could only query from `/users` in increments of 250, and for each user, another API call to `/users/:user_id/update` needed to be made to update the user information.

### Naive Approach

The easy way to solve this is to query for the 250 users, loop through those users, and send a request to update each user before going to get the next set of 250 users. Only issue here is that this is very time consuming. Even with fast internet and a M1 Mac, I was capping out at around 120 requests per minute, and to get through 2 million users, it would take 277 hours or 11.5 days of constant running. Yikes.

## Crank it with Concurrency

Our computers are surely capable of handling more than one task at a time, so we can leverage that by running the requests concurrently in separate node processes. To help us with this, we're going to employ the use of [BullMQ](https://docs.bullmq.io/), a queueing system built on top of [Redis](https://redis.io/) that will allow us to focus on cranking through our API updates instead of spending hours building out a robust queueing system.

Let's see how that's done...

### Redis Setup

Using BullMQ means we need to have a local (or remote) Redis server running. We just need the server to be running on the same port as BullMQ's queue and worker, so [install Redis](https://redis.io/docs/getting-started/) and toss this into your command prompt:

```shell
$ redis-server --port 5050
```

---

### BullMQ Config

We carry over that port number and tell BullMQ that we want to use a local Redis server with a concurrency factor of 4 (or whatever the API that you'll be blasting can handle). The API I was using had a rate limiter, so the highest I could go to is 4, but I wouldn't use more than the number of cores that your CPU has. A higher number just means more jobs are allowed to be processed in parallel.

```TypeScript
const BULL_CONFIG = {
  connection: { port: 5050, host: 'localhost' },
  concurrency: 4,
}
```

---

### Create the Queue

To initialize our queue, we need an identifier that will be used as a key prefix in the Redis store and the config to connect to Redis. Just like that, the queue is now hooked up and ready to store jobs.

```TypeScript
const queue = new Queue('users-queue', BULL_CONFIG)
```

---

### Start Filling that Queue

We want to fetch the users immediately after starting this script, so we use a recursive IIFY to go through all the paginated pages of users and fetch all 2 million users. We simply loop through all 250 users returned from each request and add a job to the queue using `queue.add()`. We give the job a name based on the type of job that it is, pass it the data that we want the Worker to receive, and use whatever job [options](https://api.docs.bullmq.io/interfaces/v4.BaseJobOptions.html) fit your needs.

```TypeScript
;(async function fetchUsers(pageNum: number = 0) {
  const response = await fetch(`/users?page=${pageNum}`)
  const data = await response.json()
  const users = data.users as User[]

  for (const user of users) {
    // Add each user to the queue as a Job
    await queue.add('update-user', user, { removeOnComplete: true })
  }

  // Check if there are more pages
  if (data.nextPage) await fetchUsers(data.nextPage)
})()
```

---

### Start the Worker

As the jobs continue to be added to the queue, it's time to get working on those jobs. We instantiate a worker with the same identifier of the queue that we used before (`'users-queue'`), giving it a callback function to handle the job when it gets picked up, and passing the same config that we gave the queue so that it's pointed at the correct Redis store.

The callback function we pass the worker accepts a job, which holds the data that we passed it from `queue.add()` (our user), and makes the appropriate fetch request to update that user. With that in place, our worker will handle the job processing (4 at a time given our concurrency setting) and categorizing (with statuses of 'waiting', 'active', 'completed', and 'failed') based on how our fetch request performs.

```TypeScript
const worker = new Worker<User, void>(
  'users-queue',
  async (job: { data: User }) => await updateUser(job.data),
  BULL_CONFIG
)

async function updateUser(user: User) {
  const response = await fetch(`/users/${user.id}/update`)
  const data = await response.json()
  return data.success
}
```

---

### Listen to Worker Completion

We don't need it for our example, but often times there is a need to do something with the job data after the job has been completed, so the worker allows us to setup an event listener for the completed event like so:

```TypeScript
worker.on('completed', async (job: { data: User }) => {
  console.log(`Job ${job.data.id} Completed!`)
})
```

---

## Put it all together

Fully assembled, our script looks like this:

```TypeScript
import { Queue, Worker } from 'bullmq'

const BULL_CONFIG = {
  connection: { port: 5050, host: 'localhost' },
  concurrency: 4,
}

const QUEUE_NAME = 'users-queue'
const JOB_NAME = 'update-user'

type User = {
  id: string
  info: any
}

const queue = new Queue(QUEUE_NAME, BULL_CONFIG)

const worker = new Worker<User, void>(
  QUEUE_NAME,
  async (job: { data: User }) => await updateUser(job.data),
  BULL_CONFIG
)

// Worker callback to update users
async function updateUser(user: User) {
  const response = await fetch(`/users/${user.id}/update`)
  const data = await response.json()
  return data.success
}

// Fetch users and add them to the queue
;(async function fetchUsers(pageNum: number = 0) {
  const response = await fetch(`/users?page=${pageNum}`)
  const data = await response.json()
  const users = data.users as User[]

  for (const user of users) {
    await queue.add(JOB_NAME, user, { removeOnComplete: true })
  }

  if (data.nextPage) await fetchUsers(data.nextPage)
})()

// Listen for job completion
worker.on('completed', async (job: { data: User }) => {
  console.log(`Job ${job.data.id} Completed!`)
})
```

---

## Results

With this setup, the time to update all 2 million users was brought from 11 days down to several hours. Saving energy and time. I hope you learned a thing or two and if you found this article interesting, feel free to hit me up on [GitHub](https://github.com/ChristianAnagnostou) or [X](https://twitter.com/coderdevguy). Cheers!
