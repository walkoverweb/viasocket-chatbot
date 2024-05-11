// const FIELDS_TO_INDEX_IN_NOTIFICATION = ['stepId']

// export const getKeyValueOfFromArrayOfNotification = (allNotifications: any[]) => {
//   const filteredNotification: { [key: string]: any[] } = {}
//   allNotifications.forEach((notification) => {
//     Object.keys(notification).forEach((key) => {
//       if (!FIELDS_TO_INDEX_IN_NOTIFICATION.includes(key)) return
//       if (!filteredNotification.hasOwnProperty(notification[key])) {
//         filteredNotification[notification[key]] = []
//       }
//       filteredNotification[notification[key]].push(notification._id)
//     })
//   })
//   console.log(filteredNotification,"filterewr")
//   return filteredNotification
// }

export const getKeyValueOfFromArrayOfNotification = (allNotifications: any[]) => {
  const transformedObject = allNotifications.reduce((acc, obj) => {
    acc[obj._id] = obj
    return acc
  }, {})
  return transformedObject
}
