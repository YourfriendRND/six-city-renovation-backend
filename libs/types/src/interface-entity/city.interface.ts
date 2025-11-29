import { CommonEntityInterface } from './common-entity.interface';
import { PlaceInterface } from './place.interface';
import { FileInterface } from './file.interface';

export interface CityInterface extends CommonEntityInterface {
  name: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  places: PlaceInterface[];
  preview: FileInterface;
}
