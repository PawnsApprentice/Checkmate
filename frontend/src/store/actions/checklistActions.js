import axios from "axios";
import {
  CHECKLIST_CREATE_FAIL,
  CHECKLIST_CREATE_REQUEST,
  CHECKLIST_CREATE_SUCCESS,
  CHECKLIST_DELETE_FAIL,
  CHECKLIST_DELETE_REQUEST,
  CHECKLIST_DELETE_SUCCESS,
  CHECKLIST_FAIL,
  CHECKLIST_REQUEST,
  CHECKLIST_SUCCESS,
  CHECKLIST_UPDATE_FAIL,
  CHECKLIST_UPDATE_REQUEST,
  CHECKLIST_UPDATE_SUCCESS,
} from "../constants/checklistConstants";

export const listChecklist =
  (keyword = "") =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: CHECKLIST_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/checklist?keyword=${keyword}`,
        config
      );

      dispatch({
        type: CHECKLIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CHECKLIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deleteChecklistItem = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CHECKLIST_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/checklist/${id}`, config);

    dispatch({
      type: CHECKLIST_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: CHECKLIST_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createChecklistItem =
  (checklist) => async (dispatch, getState) => {
    try {
      dispatch({ type: CHECKLIST_CREATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(`/api/checklist`, checklist, config);

      dispatch({
        type: CHECKLIST_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CHECKLIST_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateChecklistItem =
  (checklist, id) => async (dispatch, getState) => {
    try {
      dispatch({ type: CHECKLIST_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/checklist/${id}`,
        checklist,
        config
      );

      dispatch({
        type: CHECKLIST_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CHECKLIST_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
