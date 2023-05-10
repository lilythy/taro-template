export const CHANGE_USER = 'CHANGE_USER';

const userDetail = {
  zxInfo: {},
  dingTalkInfo: {}
};

const userStore = (state = userDetail, action) => {
  switch (action.type) {
    case CHANGE_USER:
      console.log('action.type--', action.type, action.payload)
      return {
        ...state,
        ...(action?.payload || {})
      };
    default:
      return state;
  }
};

export default userStore;
