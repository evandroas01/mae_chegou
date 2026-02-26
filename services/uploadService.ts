import { api } from './api';
import * as ImagePicker from 'expo-image-picker';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

export const uploadService = {
  async uploadFile(uri: string, type: 'image' | 'document' = 'image'): Promise<UploadResponse> {
    const formData = new FormData();
    
    // Criar nome do arquivo
    const filename = uri.split('/').pop() || `file_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1] : 'jpg';
    const typeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    
    const fileType = typeMap[ext] || 'image/jpeg';

    formData.append('file', {
      uri,
      name: filename,
      type: fileType,
    } as any);

    formData.append('type', type);

    return api.upload<UploadResponse>('/upload', formData);
  },

  async pickImage(): Promise<string | null> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permissão para acessar a galeria foi negada');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  },

  async takePhoto(): Promise<string | null> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permissão para acessar a câmera foi negada');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  },
};

