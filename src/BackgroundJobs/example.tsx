import BackgroundService from 'react-native-background-actions'

const sleep = (time: number) => new Promise(resolve => setTimeout(() => resolve(''), time))

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
const veryIntensiveTask = async (taskDataArguments: any) => {
  // Example of an infinite loop task
  const { delay } = taskDataArguments
  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      await sleep(delay)
    }
  })
}

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'com.fitnessevo://signIn', // See Deep Linking for more info
  parameters: {
    delay: 4000,
  },
}

export default async () => {
  await BackgroundService.start(veryIntensiveTask, options)
  await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' }) // Only Android, iOS will ignore this call
  // iOS will also run everything here in the background until .stop() is called
  // await BackgroundService.stop();
}
