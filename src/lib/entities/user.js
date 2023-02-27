/*---------------------------------------------------------------------------------------------
 * User
 *--------------------------------------------------------------------------------------------*/

const
{ fw } = require('../fw')
, entity = require('../interfaces/entity')
;;

module.exports = class __user extends entity {

    constructor(obj){
        super(fw.blend(obj, {
            name_       : ""
            , password_ : ""
            , email_    : ""
        }))
    }

}