import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ToDoItem from "../components/ToDoItem";
import { Button, Offcanvas, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  createChecklistItem,
  listChecklist,
} from "../store/actions/checklistActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const HomeScreen = () => {
  //hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyword } = useParams();

  //variables
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [uploading, setUploading] = useState(false);

  //retrieve state info from store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const checkList = useSelector((state) => state.checklist);
  const { loading, error, checklist } = checkList;

  const updatedCheckList = useSelector((state) => state.checklistUpdate);
  const { loading: updatedLoading, error: updateError } = updatedCheckList;

  const deletedChecklist = useSelector((state) => state.checklistDelete);
  const { loading: deletedLoading, error: deleteError } = deletedChecklist;

  const anyLoading = loading || updatedLoading || deletedLoading;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    dispatch(listChecklist(keyword));
  }, [userInfo, dispatch, navigate, keyword]);

  //METHODS
  const submitHandler = (e) => {
    e.preventDefault();
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
    dispatch(
      createChecklistItem({
        name,
        desc,
        image,
        tags: tagsArray,
      })
    ).then(() => {
      dispatch(listChecklist(keyword));
    });
    setShow(false);
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
      {(updateError || deleteError) && (
        <Message variant="danger">{updateError || deleteError}</Message>
      )}
      {anyLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Button variant="light" onClick={handleShow} className="btn-md">
            <i className="fas fa-plus fs-4"></i>{" "}
            <span className="fs-4">ADD TO-DO</span>
          </Button>
          <Offcanvas
            placement="end"
            name="end"
            show={show}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Add To Do Item</Offcanvas.Title>
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
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="desc" className="mb-3">
                  <Form.Label>Desription</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter Desc"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
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
                    required
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
                  Add
                </Button>
              </Form>
            </Offcanvas.Body>
          </Offcanvas>
          {checklist.map((item) => (
            <ToDoItem item={item} />
          ))}
        </div>
      )}
    </>
  );
};

export default HomeScreen;
