module.exports = {
  name: 'course-client-lib',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/course-client-lib',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
