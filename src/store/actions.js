const saveUserInfo = (userInfo) => {
  return {
    type: "USERINFO",
    userInfo,
  };
};
const saveAcountData = (acountData) => {
  return {
    type: "ACOUNTDATA",
    acountData,
  };
};
export { saveUserInfo, saveAcountData };