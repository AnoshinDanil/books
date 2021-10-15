import React, { useState } from 'react';
import { Card, CardTitle, CardImg, CardBody, Button, Modal, CardColumns, CardSubtitle } from 'reactstrap';

export type Book = {
    authors: string[]
    categories: string[]
    title: string
    description: string
    thumbnail: string
    pageCount: number
    language: string
    publisher: string
    previewLink: string
    infoLink: string
}

export const BookCard = ({ book: {
    thumbnail,
    title,
    pageCount,
    language,
    description,
    authors,
    categories,
    publisher,
    previewLink,
    infoLink
  }}: { book: Book }) => {
  // States
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <Card style={{ width: '233px', textAlign:'center'}} className="m-2">
      <CardImg
        style={{ width: '110px', height: '140px', boxShadow:'0 0 10px rgba(0,0,0,0.5)', marginTop:'5px' }}
        src={thumbnail}
      />
      <CardBody>
        <CardColumns className='crd-text' color='secondary'>
          {categories}  
        </CardColumns>
        <CardTitle className='crd-text'>
          {title}
        </CardTitle>
        <CardSubtitle className='crd-text'>
          {authors}
        </CardSubtitle>
        <Button className='mt-4' onClick={toggle}>More info</Button>
      </CardBody>
      <Modal isOpen={modal} toggle={toggle}>
        <div className='modal-header d-flex justify-content-center'>
          <h5 className='modal-title text-center' id='exampleModalLabel'>
            {title}
          </h5>
          <button
            aria-label='Close'
            className='close'
            type='button'
            onClick={toggle}
          >
            <span aria-hidden={true}>X</span>
          </button>
        </div>
        <div className='modal-body'>
          <div className='d-flex justify-content-between ml-3'>
            <img src={thumbnail} alt={title} style={{ height: '233px' }} />
            <div>
              <p>Page Count: {pageCount}</p>
              <p>Language : {language}</p>
              <p>Authors : {authors}</p>
              <p>Publisher : {publisher}</p>
            </div>
          </div>
          <div className='mt-3'>{description}</div>
        </div>
        <div className='modal-footer'>
          <div className='left-silde'>
            <a
              href={previewLink}
              className='btn-link'
              color='default'
              type='button'
              target='_blank'
              rel='noopener noreferrer'
            >
              Preview Link
            </a>
          </div>
          <div className='divider'></div>
          <div className='right-silde'>
            <a
              href={infoLink}
              className='btn-link'
              color='default'
              type='button'
              target='_blank'
              rel='noopener noreferrer'
            >
              Info Link
            </a>
          </div>
        </div>
      </Modal>
    </Card>
  );
};