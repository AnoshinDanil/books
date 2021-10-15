import React, { useState, useEffect } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  FormGroup,
  Spinner,
} from 'reactstrap'
import axios, { AxiosResponse } from 'axios'
import { BookCard, Book } from './BookCard'

type BooksApiResult = {
  items: {
    [key: string]: any
    volumeInfo: Record<string, any>
  }[]
  totalItems: number
}

function App() {
  //Состояние
  const [startIndex, setStartIndex] = useState<number>(0)
  const [query, setQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [books, setBooks] = useState<Book[]>([])
  const [orderBy, setOrderBy] = useState<string>('relevance')
  const [subject, setSubject] = useState<string>('')
  const [total, setTotal] = useState(0)
  const btnPress: boolean = useKeyPress('Enter')

  function useKeyPress(targetKey: string): boolean {
    const [keyPressed, setKeyPressed] = useState(false)
    function downHandler({ key }: { key: string }): void {
      if (key === targetKey) {
        setKeyPressed(true)
      }
    }

    const upHandler = ({ key }: { key: string }): void => {
      if (key === targetKey) {
        setKeyPressed(false)
      }
    }

    useEffect(() => {
      window.addEventListener('keydown', downHandler)
      window.addEventListener('keyup', upHandler)

      return () => {
        window.removeEventListener('keydown', downHandler)
        window.removeEventListener('keyup', upHandler)
      }
    }, [])
    return keyPressed
  }

  const fetch = (startInd: number): Promise<Book[]> => {
    setLoading(true)
    setTotal(0)
    return axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}+subject:${subject}&maxResults=30&startIndex=${startInd}&orderBy=${orderBy}`
      )
      .then((res: AxiosResponse<BooksApiResult>) => {
        setTotal(res.data.totalItems)
        return (res.data.items || []).map(
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
      })
      .finally(() => {
        setLoading(false)
      })
  }

  //Поиск

  const handleSubmit = () => {
    if (query) {
      fetch(startIndex).then((res) => setBooks(res))
    }
  }

  useEffect(() => {
    if (btnPress) handleSubmit()
  }, [btnPress])

  const handleCards = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center mt-3">
          <Spinner style={{ width: '3rem', height: '3rem' }} />
        </div>
      )
    }
    return books.map((book) => <BookCard book={book} />)
  }

  //Основа

  const mainHeader = () => {
    return (
      <div className="main-image d-flex justify-content-center align-items-center flex-column">
        <div className="filter"></div>
        <h1
          className="display-2 text-center text-white mb-3"
          style={{ zIndex: 2 }}
        >
          Search for books
        </h1>
        <div style={{ width: '60%', zIndex: 2 }}>
          <InputGroup size="lg" className="mb-3">
            <Input
              placeholder="Book Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button className="btn" type="submit" onClick={handleSubmit}>
              <i className="fas fa-search" />
            </Button>
          </InputGroup>
          <div className="d-flex mt-5 text-white justify-content-center">
            <FormGroup className="categories">
              <select
                aria-label="Default select example"
                color="secondary"
                onChange={(e) => setSubject(e.target.value)}
              >
                <option selected value="">
                  All
                </option>
                <option value="art">Art</option>
                <option value="biography">Boigraphy</option>
                <option value="computers">Computers</option>
                <option value="history">History</option>
                <option value="medical">Medical</option>
                <option value="poetry">Poetry</option>
              </select>
            </FormGroup>

            <FormGroup className="ml-5">
              <select
                aria-label="Default select example"
                color="secondary"
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <option selected value="relevance">
                  Relevance
                </option>
                <option value="newest">Newest</option>
              </select>
            </FormGroup>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-100 h-100">
      {mainHeader()}
      <div
        className="container my-5 text-center"
        style={{ fontWeight: 'bold' }}
      >
        Found {total} results
        <div className="row" style={{ justifyContent: 'center' }}>
          {handleCards()}
        </div>
      </div>
      <div className="col text-center after-posts">
        <button
          className="btn btn-primary load-more"
          type="button"
          onClick={() => {
            setStartIndex((prev) => prev + 30)
            fetch(startIndex + 30).then((res) =>
              setBooks((books) => [...books, ...res])
            )
          }}
        >
          <span
            className="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Load more
        </button>
      </div>
    </div>
  )
}

export default App
