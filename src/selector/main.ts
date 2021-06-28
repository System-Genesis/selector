import { logError } from '../logger/logger';
import { mergedObj } from '../types/mergedObjType';
import { entityQueue } from '../rabbit/rabbit';

export const selector = (margeObj: mergedObj): void => {
    // if only mir source dont sent to build entity
  if (margeObj.mir && Object.keys(margeObj).length <= 2) {
    logError('error');
  } else {
    entityQueue(margeObj);
  }


};


