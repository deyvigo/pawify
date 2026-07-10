import { API_URL, authToken } from "../config";

export interface BuyerImageResponse {
  id: number;
  url: string;
}

export const updateProfileImage = (imageUri: string): Promise<BuyerImageResponse> => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  } as any);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `${API_URL}/buyer/profile`);
    if (authToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        console.error('Update profile image error:', xhr.responseText);
        reject(new Error(xhr.responseText || `Error ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Error de red'));
    xhr.send(formData);
  });
};
