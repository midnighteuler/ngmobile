# [ngMobile](http://github.com/midnighteuler/ngmobile)

A boiler-plate for large ionic projects built initially from [ionic-generator](http://ng-learn.org/2014/05/Going_Mobile_with_Ionic/), and patterned in the spirit of [ngbp](http://joshdmiller.github.com/ng-boilerplate)

It uses grunt, bower, sass, jasmine && phantomjs, livereload, ionic, cordova.
***

## Quick Start

### Initial Setup
```sh
$ git clone git://github.com/midnighteuler/ngmobile
```

Importantly: I isolated all setup, testing, packaging, etc scripts and tools into the /ops directory.

The bash script `setup.sh` will download a binary release of nodejs and set up path variables so that it
can be used in a self-contained manner from ops/.nodejsenv.

You'll need to edit `node_version.sh` to set the version you want. I put some defaults there.

After having done so:
```sh
$ cd ngmobile/ops
$ source setup.sh
$ grunt serve
```

This ultimately uses `ionic serve`, but also watches your files for changes and performs appropriate updates.

### After initial setup
To resume work you'll need the path variables set, so run:
```sh
$ cd ngmobile/ops
$ source init.sh
$ grunt serve
```

## Directory Structure

### /ops
Contains nodejs, nodejs modules, gruntfile, init scripts.

You'll always run grunt/npm/bower tasks from here.

### /doc
A place to write nice notes to yourself.

### /src
Contains the cordova app components. You can run ionic/cordova commands here, but those are also all wrapped in the gruntfile. (See [ionic-generator](http://ng-learn.org/2014/05/Going_Mobile_with_Ionic/))

The application to hack away on lives in `src/app`.
Grunt compiles that source continuously into `src/www`.


Within `src/app` things are structured in feature-consolidated manner, as described [here (ngbp)](https://github.com/ngbp/ngbp/blob/v0.3.2-release/src/README.md).

## To Do
Doesn't package very well yet; things aren't minimized and consolidated into two nice package files as in ngbp.
The auto-generated inclusion of sources into the index.html page is also not implemented as is done there.