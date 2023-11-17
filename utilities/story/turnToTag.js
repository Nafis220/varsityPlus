const turnToTag = (subject) => {
  const newArray = subject.split(" ");
  const firstLetters = newArray.map((word) => word.charAt(0).toUpperCase());
  const tag = `#${firstLetters.join("")}`;
  return tag;
};
module.exports = turnToTag;
