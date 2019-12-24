import React, { useState, useRef, useContext } from "react";

import axios from "axios";

import AuthContext from "../context/auth-context";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

import "./Events.css";

const Events = () => {
  const [createEvent, setCreateEvent] = useState(false);
  const [events, setEvents] = useState([]);

  const titleEl = useRef(null);
  const priceEl = useRef(null);
  const dateEl = useRef(null);
  const descriptionEl = useRef(null);

  const context = useContext(AuthContext);
  const token = context.token;

  const startCreateEventHandler = () => {
    setCreateEvent(true);
  };

  const modalConfirmHandler = async () => {
    setCreateEvent(false);
    const title = titleEl.current.value;
    const price = +priceEl.current.value;
    const date = dateEl.current.value;
    const description = descriptionEl.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price:"${price}", date:"${date}"}){
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/graphql",
        JSON.stringify(requestBody),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      console.log(response.data.data);

      fetchEvents();
    } catch (error) {
      console.log(error);
    }
  };

  const modalCancelHandler = () => {
    setCreateEvent(false);
  };

  const fetchEvents = async () => {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/graphql",
        JSON.stringify(requestBody),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      console.log(response.data.data);

      const events = response.data.data.events;
      setEvents([...events]);
    } catch (error) {
      console.log(error);
    }
  };

  const eventsList = events.map(event => {
    return (
      <li key={event._id} className="events__list-item">
        {event.title}
      </li>
    );
  });

  return (
    <React.Fragment>
      {createEvent && <Backdrop />}
      {createEvent && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleEl} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceEl} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateEl} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={descriptionEl}></textarea>
            </div>
          </form>
        </Modal>
      )}
      {context.token && (
        <div className="events-control">
          <p>Show your own Events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      <ul className="events__list">{eventsList}</ul>
    </React.Fragment>
  );
};

export default Events;
