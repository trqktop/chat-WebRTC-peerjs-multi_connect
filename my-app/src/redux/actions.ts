function getActions() {
  let actions = [
    {
      reducerAction: "chat/getUsers",
      socketAction: "GET_USERS",
    },
    // {
    //   reducerAction: "chat/updateMessages",
    //   socketAction: "REQUEST_MESSAGES",
    // // },
    // {
    //   reducerAction: "chat/getMessage",
    //   socketAction: "GET_MESSAGES",
    // },
    // {
    //   reducerAction: "chat/sendMessage",
    //   socketAction: "GET_MESSAGES",
    // },
  ];

  return {
    actions,
  };
}

export { getActions };
