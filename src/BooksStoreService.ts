import { observable } from 'mobx'
import { Book } from './BookCard'
import axios, { AxiosResponse } from 'axios'

type BooksApiResult = {
  items: {
    [key: string]: any
    volumeInfo: Record<string, any>
  }[]
  totalItems: number
}

class BooksStoreService {
  @observable queries: Map<string, { total: number; items: Book[] }> = new Map()

  private createUrl(
    query = '',
    subject = '',
    startIndex = 0,
    orderBy = 'relevance'
  ): string {
    return `https://www.googleapis.com/books/v1/volumes?q=${query}+subject:${subject}&maxResults=30&startIndex=${startIndex}&orderBy=${orderBy}`
  }

  public async fetch(
    query: string,
    subject: string,
    startIndex: number,
    orderBy: string
  ): Promise<{ total: number; items: Book[] }> {
    const url = this.createUrl(query, subject, startIndex, orderBy)
    const res = (await axios.get(url)) as AxiosResponse<BooksApiResult>
    const items = (res.data.items || []).map(
      ({
        volumeInfo: {
          publisher,
          previewLink,
          infoLink,
          categories,
          title,
          authors,
          description,
          imageLinks,
          language,
        },
      }) => ({
        language,
        categories,
        authors,
        title,
        description,
        thumbnail: imageLinks ? imageLinks.thumbnail : '',
        pageCount: 0,
        publisher,
        previewLink,
        infoLink,
      })
    )
    const data = {
      total: res.data.totalItems,
      items,
    }
    this.queries.set(url, data)
    return data
  }

  public async get(
    query: string,
    subject: string,
    startIndex: number,
    orderBy: string
  ): Promise<{ total: number; items: Book[] }> {
    const url = this.createUrl(query, subject, startIndex, orderBy)
    const cachedData = this.queries.get(url)
    if (cachedData) return cachedData
    return this.fetch(query, subject, startIndex, orderBy)
  }
}

export default new BooksStoreService()
