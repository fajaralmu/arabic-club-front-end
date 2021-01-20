import * as common from './Common'
import * as types from '../redux/types'

const POST_METHOD = "post";
   

export const removeEntityMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REMOVE_SHOP_ENTITY) { return next(action); }
    let newAction = Object.assign({}, action, { payload: null });
    delete newAction.meta;
    store.dispatch(newAction); 
}
  
export const updateCartMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.UPDATE_CART) { return next(action); }
    let newAction = Object.assign({}, action, { payload: action.payload });
    delete newAction.meta;
    store.dispatch(newAction);
    const apps:any[] = action.payload.apps;
    for (let i = 0; i < apps.length; i++) {
        const app = apps[i];
        if (app.refresh){ 
            app.refresh();
        }
    }
}

