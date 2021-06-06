import { MetaData } from "metadata-scraper/lib/types";
import getMetaData from "metadata-scraper";

export default class UrlMetadataService {
  static async getUrlMetadata(url: string): Promise<MetaData> {
    return getMetaData(url);
  }
}
