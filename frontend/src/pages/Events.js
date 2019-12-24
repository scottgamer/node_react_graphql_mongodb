import React, { useState } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

import "./Events.css";

const Events = () => {
  const [createEvent, setCreateEvent] = useState(false);

  const startCreateEventHandler = () => {
    setCreateEvent(true);
  };

  const modalConfirmHandler = () => {
    setCreateEvent(false);
  };

  const modalCancelHandler = () => {
    setCreateEvent(false);
  };

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
          <p>Modal Content</p>
        </Modal>
      )}
      <div className="events-control">
        <p>Show your own Events!</p>
        <button className="btn" onClick={startCreateEventHandler}>
          Create Event
        </button>
      </div>
    </React.Fragment>
  );
};

export default Events;
