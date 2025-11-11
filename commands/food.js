import axios from 'axios'
import template from '../templates/food.json' with { type: 'json' }
import { distance } from '../utils/distance.js'
// import fs from 'node:fs'

export default async (event) => {
  try {
    const { data } = await axios.get(
      'https://data.moa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx?IsTransData=1&UnitId=193',
    )
    const bubbles = data
      // 每筆資料夾上 distance 欄位，代表每個東西距離使用者的公里
      .map((value) => {
        value.distance = distance(
          value.Latitude,
          value.Longitude,
          event.message.Latitude,
          event.message.Longitude,
          'K',
        )
        return value
      })
      // 由小 > 大排序
      .sort((a, b) => {
        return a.distance - b.distance
      })
      // 取前 3 資料
      .slice(0, 3)
      .map((value) => {
        // 把縣市、鄉鎮、地址組合起來
        const address = value.City + value.Town + value.Address
        // 用經緯度產生 Google Map 連結
        const googleMapUrl = `https://www.google.com/maps/@${value.Latitude},${value.Longitude},18.5z`
        // 有些資料沒有網址，需要用 Google Map 連結替代
        const url = value.Url || googleMapUrl
        // 有些資料沒有圖片，需要用其他圖片替代
        const picUrl = value.PicUrl || 'https://placehold.co/600x400?text=No+Images'
        // 有些資料沒有電話，需要用其他文字替代
        const tel = value.Tel || '-'

        // 將資料帶入 Flex 卡片模板
        const bubble = JSON.parse(JSON.stringify(template))
        bubble.hero.url = picUrl
        bubble.body.contents[0].text = value.Name
        bubble.body.contents[1].contents[0].contents[1].text = address
        bubble.body.contents[1].contents[1].contents[1].text = tel
        bubble.footer.contents[0].action.uri = url
        bubble.footer.contents[1].action.uri = googleMapUrl

        return bubble
      })
    const result = await event.reply({
      type: 'flex',
      altText: '農村美食',
      contents: {
        type: 'carousel',
        contents: bubbles,
      },
    })

    if (result.message) {
      await event.reply('發生錯誤')
      console.log(result)
      // fs.writeFileSync('./dump/food.json', JSON.stringify(bubbles, null, 2))
    }
  } catch (error) {
    await event.reply('發生錯誤')
    console.log(error)
  }
}
