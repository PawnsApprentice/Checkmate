import { React, useState } from "react";
import { Button, Card, Form, Offcanvas } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  deleteChecklistItem,
  listChecklist,
  updateChecklistItem,
} from "../store/actions/checklistActions";
import Loader from "../components/Loader";

const ToDoItem = ({ item }) => {
  const dispatch = useDispatch();

  //states
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [uploading, setUploading] = useState(false);

  //METHODS
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete the item?")) {
      dispatch(deleteChecklistItem(id)).then(() => {
        dispatch(listChecklist());
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const tagsArray = tags.split(",").map((tag) => tag.trim());
    dispatch(
      updateChecklistItem(
        {
          name,
          desc,
          image,
          tags: tagsArray,
        },
        item._id
      )
    ).then(() => {
      dispatch(listChecklist());
    });
    setShow(false);
  };

  const completeHandler = (item) => {
    if (window.confirm("Have you completed the task?")) {
      item.status = "COMPLETED";
      dispatch(updateChecklistItem(item, item._id)).then(() => {
        dispatch(listChecklist());
      });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <>
      <Card
        bg={item.status === "COMPLETED" ? "success" : "dark"}
        className="my-3 rounded"
        text="white"
      >
        <Card.Header style={{ fontSize: "24px" }}>{item.name}</Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between flex-wrap align-items-center">
            <div className="d-flex align-items-center">
              <img
                src={item.image}
                alt="profile"
                className="rounded-circle"
                style={{ height: "50px", width: "50px", marginRight: "10px" }}
              />
              <Card.Text className="mb-2">{item.description}</Card.Text>
            </div>
            <div>
              {item.status !== "COMPLETED" && (
                <Button
                  style={{ marginRight: "8px" }}
                  variant="outline-light"
                  onClick={handleShow}
                >
                  <i
                    style={{ color: "LightSkyBlue" }}
                    className="fas fa-edit"
                  ></i>
                </Button>
              )}
              <Button
                variant="outline-light"
                onClick={() => deleteHandler(item._id)}
              >
                <i className="fas fa-trash text-danger"></i>
              </Button>
              {item.status !== "COMPLETED" && (
                <Button
                  style={{ marginLeft: "8px" }}
                  variant="outline-light"
                  onClick={() => completeHandler(item)}
                >
                  <i style={{ color: "Green" }} className="fas fa-check"></i>
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
      <Offcanvas placement="end" name="end" show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Edit To Do Item</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="toDoName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="desc" className="mb-3">
              <Form.Label>Desription</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={{ resize: "both" }}
              />
            </Form.Group>
            <Form.Group controlId="tags" className="mb-3">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Tags seperated by commas"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={{ resize: "both" }}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group
              controlId="formFile"
              className="my-2"
              onChange={uploadFileHandler}
              value={image}
            >
              <Form.Control type="file" />
            </Form.Group>
            {uploading && <Loader />}
            <Button className="mt-2" type="submit" variant="primary">
              Update
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ToDoItem;
