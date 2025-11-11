import axios from 'axios'

export default async (event) => {
  try {
    // 取得匯率
    const { data } = await axios.get('https://tw.rter.info/capi.php')
    // 回覆
    const result = await event.reply(data.USDTWD.Exrate.toString())
    // 回覆成功
    // {
    //   sentMessages: []
    // }
    // 回覆失敗
    // {
    //   message: ''
    // }
    if (result.message) {
      await event.reply('發生錯誤')
      console.log(result)
    }
  } catch (error) {
    console.log(error)
  }
}
