import axios from 'axios';
import Config from 'react-native-config';
export default class AppConfigService {
  constructor() {
    this.uploadFile = this.uploadFile.bind(this);
  }

  async uploadFile(form: FormData, token: string): Promise<any> {
    const options = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
    const url = `${Config.API_URL}/graphql`;
    const { data } = await axios.post(url, form, options);
    return data[0];
  }
}
