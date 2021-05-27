import { AUTHOR_TYPE } from '../constants/type';

export const convertAuthorType = function (authorType) {
  switch (authorType) {
    case AUTHOR_TYPE.OFFICIAL_USER.name: return '机构';
    case AUTHOR_TYPE.DOCTOR.name: return '医生';
    case AUTHOR_TYPE.EXPERT.name: return '专家';
    default: return;
  }
};

export const convertGender = function (gender) {
  if (!gender) return;
  switch (gender) {
    case '1': return '女';
    default: return '男';
  }
};

export const convertBoolean = function (value) {
  if (value) return '是';
  return '否';
};

export const convertDate = function (value) {
  return new Date(value).toDateString();
};

export const stripText = function (text) {
  return text && text.length > 20 ? `${text.substring(0, 20)}...` : text;
};

export const convertType = function (type) {
  if (!type) return;
  switch (type) {
    case 'HOSPITAL': return '医院';
    case 'COMPANY': return '公司';
    default: return type;
  }
};

export const parseCoAuthors = function (coAuthors) {
  const authors = coAuthors.map((coAuthor) => {
    coAuthor = (coAuthor.authorType === AUTHOR_TYPE.DOCTOR.name 
      ? coAuthor.doctor 
      : (coAuthor.authorType === AUTHOR_TYPE.EXPERT.name ? coAuthor.expert : coAuthor.officialUser));
    return coAuthor === null ? '' : coAuthor.name;
  });
  return stripText(authors && authors.join(', '));
};


export const getAuthor = function (item) {
  if(!item || !item.authorType) return;
  switch(item.authorType) {
    case AUTHOR_TYPE.DOCTOR.name:
      return item.doctor;
    case AUTHOR_TYPE.EXPERT.name:
      return item.expert;
    case AUTHOR_TYPE.OFFICIAL_USER.name:
      return item.officialUser;
    default:
      return;
  }
};