'use strict';

const _ = {
    uniqWith: require('lodash.uniqwith'),
    isEqual: require('lodash.isequal')
};

// TODO: cache
module.exports = function resolveSets(sets) {
    return Object.keys(sets).reduce((acc, setName) => {
        acc[setName] = _.uniqWith(resolveSet(sets[setName], setName, sets), _.isEqual);
        return acc;
    }, {});
}

function resolveSet(setData, setName, sets) {
    if (typeof setData !== 'string') {
        return Array.isArray(setData) ? setData : [setData];
    }

    return setData.split(' ').reduce((setDataAcc, layerStr) => {
        let layerName, libName;

        if (!layerStr.includes('@')) {
            setDataAcc.push({ layer: layerStr });
            return setDataAcc;
        }

        [layerName, libName] = layerStr.split('@');

        if (!layerName) {
            let layerNameArr;
            [libName, ...layerNameArr] = libName.split('/');

            setDataAcc.push({
                layer: layerNameArr.length ? layerNameArr.join('/') : setName,
                library: libName
            });

            return setDataAcc;
        }

        if (libName.includes('/')) {
            throw new Error(`You can't use set and layer simultaneously`);
        }

        if (!libName) {
            return setDataAcc.concat(resolveSet(sets[layerName], setName, sets));
        }

        setDataAcc.push({
            set: layerName,
            library: libName
        });

        return setDataAcc;
    }, []);
}
