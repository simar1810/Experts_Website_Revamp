export const reducer = function (state, action) {
  switch (action.type) {
    case "SET_SELECTED_PLAN_CODE":
      return {
        ...state,
        selectedPlanCode: action.payload,
      };
    case "UPDATE_NO_MONTHS":
      return {
        ...state,
        noOfMonths: action.payload,
      };
    case "UPDATE_UI_STATE":
      return {
        ...state,
        stage: action.payload,
      };
    case "UPDATE_IS_ADMIN":
      return {
        ...state,
        isAdmin: action.payload,
      };
    case "UPDATE_FIELDS":
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
};

export const selectPlanCode = function (payload) {
  return {
    type: "SET_SELECTED_PLAN_CODE",
    payload,
  };
};

export const updateNoOfMonths = function (payload) {
  return {
    type: "UPDATE_NO_MONTHS",
    payload,
  };
};

export const updateUIState = function (payload) {
  return {
    type: "UPDATE_UI_STATE",
    payload,
  };
};

export const updateIsAdmin = function (payload) {
  return {
    type: "UPDATE_IS_ADMIN",
    payload,
  };
};

export const updatePayload = function (payload) {
  return {
    type: "UPDATE_FIELDS",
    payload
  }
}