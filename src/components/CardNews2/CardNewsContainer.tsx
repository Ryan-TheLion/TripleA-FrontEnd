import React from 'react'
import { NewsData } from '@/interfaces/NewsData'
import CardNews from './index'

interface CardNewsContainerProps {
  newsArr: NewsData[],
  cardDirection: string,
  type:string
}

export default function CardNewsContainer({newsArr, cardDirection, type}:CardNewsContainerProps) {
  return (
    <div className={type==='hotNews'?'flex flex-wrap gap-[10px] m-auto justify-center':'flex flex-wrap gap-[10px] m-auto'}>
    {newsArr.map((news:NewsData)=>
      <CardNews cardDirection={cardDirection} key={news.newsId} newsId={news.newsId} symbol={news.symbol} source={news.source} title={news.title}  thumbnail={news.thumbnail} publishedDate={news.publishedDate} sentiment={news.sentiment} bookmark={news.bookmark}/>
    )}
    </div>
  )
}
