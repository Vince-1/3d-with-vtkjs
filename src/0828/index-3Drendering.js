import 'vtk.js/Sources/favicon';

import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkHttpDataSetReader from 'vtk.js/Sources/IO/Core/HttpDataSetReader';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';

import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';

import vtkInteractorStyleManipulator from 'vtk.js/Sources/Interaction/Style/InteractorStyleManipulator';
import Manipulators from 'vtk.js/Sources/Interaction/Manipulators';

import vtkCamera from 'vtk.js/Sources/Rendering/Core/Camera';

import vtkPointPicker from 'vtk.js/Sources/Rendering/Core/PointPicker';
import vtkSphereSource from 'vtk.js/Sources/Filters/Sources/SphereSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkLineSource from 'vtk.js/Sources/Filters/Sources/LineSource';

import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';

import vtkOrientationMarkerWidget from 'vtk.js/Sources/Interaction/Widgets/OrientationMarkerWidget';
import vtkAnnotatedCubeActor from 'vtk.js/Sources/Rendering/Core/AnnotatedCubeActor';

// const volRenderer = vtkRenderer.newInstance();
// const volRenderWindow = vtkRenderWindow.newInstance();

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
    background: [0, 0, 0],
  });
const volRenderer = fullScreenRenderer.getRenderer();
const volRenderWindow = fullScreenRenderer.getRenderWindow();

const vol = vtkVolume.newInstance();
const volMapper = vtkVolumeMapper.newInstance();

volMapper.setSampleDistance(2.0);
vol.setMapper(volMapper);

const volReader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });
volReader.setUrl(`/headsq.vti`).then(() => {
    volReader.loadData().then(() => {
    // we wait until the data is loaded before adding
    // the volume to the renderer
    volRenderer.addVolume(vol);
    volRenderer.resetCamera();
    volRenderWindow.render();
    });
});

// create color and opacity transfer functions
const ctfun = vtkColorTransferFunction.newInstance();
ctfun.addRGBPoint(200.0, 1.0, 1.0, 1.0);
ctfun.addRGBPoint(2000.0, 0.0, 0.0, 0.0);

const ofun = vtkPiecewiseFunction.newInstance();
ofun.addPoint(500.0, 0.0);
ofun.addPoint(1000.0, 0.2);
ofun.addPoint(2000.0, 0.4);

vol.getProperty().setRGBTransferFunction(0, ctfun);
vol.getProperty().setScalarOpacity(0, ofun);
vol.getProperty().setScalarOpacityUnitDistance(0, 4.5);
vol.getProperty().setInterpolationTypeToFastLinear();

volMapper.setInputConnection(volReader.getOutputPort());

const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
volRenderWindow.addView(openglRenderWindow);

const container = document.getElementById("C")
openglRenderWindow.setContainer(container);

// create axes
const axes = vtkAnnotatedCubeActor.newInstance();
axes.setDefaultStyle({
  text: '+X',
  fontStyle: 'bold',
  fontFamily: 'Arial',
  fontColor: 'black',
  fontSizeScale: (res) => res / 2,
  faceColor: '#0000ff',
  faceRotation: 0,
  edgeThickness: 0.1,
  edgeColor: 'black',
  resolution: 400,
});
// axes.setXPlusFaceProperty({ text: '+X' });
axes.setXMinusFaceProperty({
  text: '-X',
  faceColor: '#ffff00',
  faceRotation: 90,
  fontStyle: 'italic',
});
axes.setYPlusFaceProperty({
  text: '+Y',
  faceColor: '#00ff00',
  fontSizeScale: (res) => res / 4,
});
axes.setYMinusFaceProperty({
  text: '-Y',
  faceColor: '#00ffff',
  fontColor: 'white',
});
axes.setZPlusFaceProperty({
  text: '+Z',
  edgeColor: 'yellow',
});
axes.setZMinusFaceProperty({ text: '-Z', faceRotation: 45, edgeThickness: 0 });

// create orientation widget
const orientationWidget = vtkOrientationMarkerWidget.newInstance({
  actor: axes,
  interactor: volRenderWindow.getInteractor(),
});
orientationWidget.setEnabled(true);
orientationWidget.setViewportCorner(
  vtkOrientationMarkerWidget.Corners.BOTTOM_RIGHT
);
orientationWidget.setViewportSize(0.15);
orientationWidget.setMinPixelSize(100);
orientationWidget.setMaxPixelSize(300);
