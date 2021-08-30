import { api } from '../api';

export const getFile = (accept) =>
  new Promise((resolve) => {
    const uploaderInput = document.createElement('input');
    uploaderInput.type = 'file';
    uploaderInput.style.opacity = '0';
    if (accept) uploaderInput.accept = accept;
    uploaderInput.style.height = '0';
    document.body.appendChild(uploaderInput);
    /**
     * Add Listener
     */
    uploaderInput.addEventListener('change', (e) => {
      resolve(e.target.files);
    });
    uploaderInput.click();
  });

export const upload = async (accept = '') => {
  const files = await getFile(accept);
  const uploadFormData = new FormData();
  uploadFormData.append('file', files[0]);
  uploadFormData.append('message', 'hello');
  console.log(uploadFormData);
  const { data } = await api.post('/file/upload', uploadFormData);
  return data;
};
