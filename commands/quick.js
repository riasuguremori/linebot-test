export default (event) => {
  event.reply({
    type: 'text',
    text: '請選擇',
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'message',
            text: 'usd',
            label: '查美元匯率',
          },
        },
        {
          type: 'action',
          action: {
            type: 'location',
            label: 'location',
          },
        },
        {
          type: 'action',
          action: {
            type: 'uri',
            uri: 'https://line.me',
            label: '打開 line 官網',
          },
        },
        {
          type: 'action',
          action: {
            type: 'postback',
            label: 'postback測試',
            data: 'test',
          },
        },
      ],
    },
  })
}
