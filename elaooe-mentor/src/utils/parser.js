const typeMap = {
  '【听力选择】': 'LISTEN_SELECT',
  '【听力判断】': 'LISTEN_DETERMINE',
  '【口语复述】': 'ORAL_WITH_TEXT',
  '【口语模仿朗读】': 'ORAL_WITH_AUDIO',
};

function readQuestion(input = '') {
  const arr = input.split('|').map((item) => item.trim());
  const type = typeMap[arr[0]];
  if (['LISTEN_SELECT', 'LISTEN_DETERMINE'].some((v) => v === type)) {
    const fields = arr[3].split('/').map((item) => item.trim());
    const struct = {
      type: type,
      name: arr[1],
      content: {
        content: arr[2],
        audioSrc: '',
        fields: fields.map((v, idx) => ({ id: idx, answer: v })),
        answer: arr[4],
      },
    };
    return struct;
  } else {
    const struct = {
      type: type,
      name: arr[1],
      content: {
        audioSrc: '',
      },
    };

    if (arr[2]) {
      struct.content.content = arr[2];
    }

    return struct;
  }
}

export function readAll(input = '') {
  return input
    .split('---')
    .map((item) => item.trim())
    .map((item) => readQuestion(item));
}
