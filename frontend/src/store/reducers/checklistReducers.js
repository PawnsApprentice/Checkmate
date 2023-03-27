import {
  CHECKLIST_CREATE_FAIL,
  CHECKLIST_CREATE_REQUEST,
  CHECKLIST_CREATE_RESET,
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

export const checklistReducer = (state = { checklist: [] }, action) => {
  switch (action.type) {
    case CHECKLIST_REQUEST:
      return { loading: true, checklist: [] };
    case CHECKLIST_SUCCESS:
      return {
        loading: false,
        checklist: action.payload,
        // pages: action.payload.pages,
        // page: action.payload.page,
      };
    case CHECKLIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const checklistDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case CHECKLIST_DELETE_REQUEST:
      return { loading: true };
    case CHECKLIST_DELETE_SUCCESS:
      return { loading: false, success: true };
    case CHECKLIST_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const checklistCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case CHECKLIST_CREATE_REQUEST:
      return { loading: true };
    case CHECKLIST_CREATE_SUCCESS:
      return { loading: false, success: true, checklist: action.payload };
    case CHECKLIST_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case CHECKLIST_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const checklistUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case CHECKLIST_UPDATE_REQUEST:
      return { loading: true };
    case CHECKLIST_UPDATE_SUCCESS:
      return { loading: false, success: true, checklist: action.payload };
    case CHECKLIST_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
