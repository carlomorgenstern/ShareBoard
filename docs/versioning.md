# Versioning of ShareBoard

The ShareBoard application follows the [semver](https://semver.org/spec/v2.0.0.html) versioning specification. This means that the version consists of a major, minor and patch level (eg. major.minor.patch -> 1.2.3) where the lower level digits are reset if a higher level digit increases.

Changes to the structure or behaviour of existing interfaces in the application, so called "breaking changes", require at least a minor level change in the version. Don't hesitate to consider a major level change for larger breaking changes. Bugfixes and small, optional enhancements should mostly require a patch level update.

In the changelog, each released version has to be denoted with its full version string, the release date and a list of descriptions for the changes that have been made. For easier reading of the changelog, consider publishing the released versions with a headline level corresponding to its version level change.
