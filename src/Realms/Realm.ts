import Realm from 'realm'
import { EarningCalendarSchema } from './Schemas/EarningCalendarSchema'
import { TickerDetailDisplaySchema } from './Schemas/TickerDetailDisplaySchema'

export const initRealm = async () => {
  const realm = new Realm({
    schemaVersion: 2,
    // path: 'default.realm',
    schema: [EarningCalendarSchema, TickerDetailDisplaySchema],
    migration: (oldRealm, newRealm) => {
      //   const msgOldObjs = oldRealm.objects('Message');
      //   const msgNewObjs = newRealm.objects('Message');
      //   for (let i = 0; i < msgOldObjs.length; i++) {
      //     msgNewObjs[i]._id = ObjectId();
      //     msgNewObjs[i].roomId = '';
      //     msgNewObjs[i].userId = '';
      //     msgNewObjs[i].msgId = null;
      //     msgNewObjs[i].createdDate = moment().toISOString()
      //     msgNewObjs[i].system = false
      //     msgNewObjs[i].userName = ''
      //     msgNewObjs[i].avatar = ''
      //     msgNewObjs[i].sent = false
      //     msgNewObjs[i].msg = msgOldObjs[i].msg;
      //     msgNewObjs[i].images = []
      //     msgNewObjs[i].notRead = false
      //   }
      //   // const notiOldObjs = oldRealm.objects('Notification');
      //   // const notiNewObjs = newRealm.objects('Notification');
      //   //
      //   // for (let i = 0; i < msgOldObjs.length; i++) {
      //   //   notiNewObjs[i]._id = ObjectId();
      //   //   notiNewObjs[i].notificationId = '';
      //   //   notiNewObjs[i].relevantId = '';
      //   //   notiNewObjs[i].createdDate = moment().toISOString()
      //   // }
      //   const roomOldObjs = oldRealm.objects('Room');
      //   const roomNewObjs = newRealm.objects('Room');
      //   for (let i = 0; i < roomOldObjs.length; i++) {
      //     roomNewObjs[i]._id = ObjectId();
      //     roomNewObjs[i].ownerId = '';
      //     roomNewObjs[i].status = 'inactive'
      //     roomNewObjs[i].roomUrl = null
      //     roomNewObjs[i].createdDate = moment().toISOString()
      //     roomNewObjs[i].updatedDate = moment().toISOString()
      //     // roomNewObjs[i].lastFetchTime = moment().toISOString()
      //     roomNewObjs[i].roomName = ''
      //     roomNewObjs[i].roomDesc = ''
      //     roomNewObjs[i].roomUserIds = []
      //     roomNewObjs[i].lastMsg = ''
      //     roomNewObjs[i].lastMsgAuthorName = ''
      //     roomNewObjs[i].lastMsgCreatedDate = moment().toISOString()
      //     roomNewObjs[i].key = ''
      //   }
    },
  })
  return realm
}
