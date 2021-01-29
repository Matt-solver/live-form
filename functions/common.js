module.exports = {
  //(Common)모든 특수문자 제거
  regExp: (str) => {
    const reg = /[\]?.,;:|*~`!^\-_+<>@$%&\\]/gi;
    return reg.test(str) ? str.replace(reg, "") : str;
  },
  //(Common)숫자만 추출
  extractInt: (str) => {
    const reg = /[^0-9]/g;
    return reg.test(str) ? str.replace(reg, "") : str;
  },
  //(Common)문자만 추출
  extractString: (str) =>
    /[^a-zA-Z]/g.test(str) ? str.replace(/[^a-zA-Z]/g, "") : str,

  //(Common)한글만 추출
  extractHangul: (str) => {
    const reg = /[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/gi;
    return reg.test(str) ? str.replace(reg, "") : str;
  },
  //(Common)모든 공백제거
  rmBlank: (str) => str.replace(/(\s*)/g, ""),
};
