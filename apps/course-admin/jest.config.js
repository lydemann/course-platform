module.exports = {
  name: 'course-admin',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/course-admin',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
