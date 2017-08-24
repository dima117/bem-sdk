const assert = require('assert');
const resolveSets = require('../lib/resolve-sets');

describe('resolve-sets', function() {
    it('should support objects', function() {
        assert.deepEqual(
            resolveSets({ setName: { layer: 'one' } }),
            { setName: [{ layer: 'one' }] }
        );
    });

    it('should support arrays', function() {
        assert.deepEqual(
            resolveSets({ setName: [{ layer: 'one' }, { layer: 'two' }] }),
            { setName: [{ layer: 'one' }, { layer: 'two' }] }
        );
    });

    it('should resolve layers', function() {
        assert.deepEqual(
            resolveSets({ setName: 'one two' }),
            { setName: [{ layer: 'one' }, { layer: 'two' }] }
        );
    });

    it('should resolve sets', function() {
        assert.deepEqual(
            resolveSets({
                setName: 'setName2@ common blah some-layer',
                setName2: 'common desktop blah'
            }),
            {
                setName: [{ layer: 'common' }, { layer: 'desktop' }, { layer: 'blah' }, { layer: 'some-layer' }],
                setName2: [{ layer: 'common' }, { layer: 'desktop' }, { layer: 'blah' }]
            }
        );
    });

    // it('should respect order', function() {
    //     assert.deepEqual(
    //         resolveSets({
    //             setName: 'setName2@ common blah some-level',
    //             setName2: 'common desktop blah'
    //         }),
    //         {
    //             setName: [{ level: 'common' }, { level: 'desktop' }, { level: 'blah' }, { level: 'some-level' }],
    //             setName: [{ level: 'common' }, { level: 'desktop' }, { level: 'blah' }, { level: 'some-level' }],
    //             setName2: [{ level: 'common' }, { level: 'desktop' }, { level: 'blah' }]
    //         }
    //     );
    // });

    describe('libs', function() {
        it('should resolve lib layers', function() {
            assert.deepEqual(
                resolveSets({ setName: '@lib1/layer1' }),
                { setName: [{ library: 'lib1', layer: 'layer1' }] }
            );
        });

        it('should resolve lib sets', function() {
            assert.deepEqual(
                resolveSets({ setName: 'set1@lib1' }),
                { setName: [{ library: 'lib1', set: 'set1' }] }
            );
        });

        it('should resolve lib on current layer', function() {
            assert.deepEqual(
                resolveSets({ setName: '@lib1' }),
                { setName: [{ library: 'lib1', layer: 'setName' }] }
            );
        });
    });
});

// var r = resolveSets({
//     // Will use `touch-phone` set from bem-components and few local levels
//     'touch-phone': '@bem-components/touch-phone common touch touch-phone',
//     'touch-pad': '@bem-components common deskpad touch touch-pad',
//     // Will use `desktop` set from `bem-components`, and also few local levels
//     'desktop': '@bem-components common deskpad desktop',
//     // Will use mix of levels from `desktop` and `touch-pad` level sets from `core`, `bem-components` and locals
//     'deskpad': 'desktop@core touch-pad@core desktop@bem-components touch-pad@bem-components desktop@ touch-pad@'
// });

// console.log(r);
