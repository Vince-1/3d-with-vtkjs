
import 'vtk.js/Sources/favicon';

import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkInteractorStyleManipulator from 'vtk.js/Sources/Interaction/Style/InteractorStyleManipulator';

import Manipulators from 'vtk.js/Sources/Interaction/Manipulators';

import vtkHttpDataSetReader from 'vtk.js/Sources/IO/Core/HttpDataSetReader';

import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';

const { SlicingMode } = vtkImageMapper;
const renderWindow = vtkRenderWindow.newInstance();

const rendererI = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
rendererI.setViewport(0,0.5,0,0.5);

const rendererJ = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
rendererJ.setViewport(0,0.5,0.5,1);

const rendererK = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
rendererK.setViewport(0.5,1,0,0.5);

const mapperI = vtkImageMapper.newInstance();
const mapperJ = vtkImageMapper.newInstance();
const mapperK = vtkImageMapper.newInstance();

const actorI = vtkImageSlice.newInstance();
const actorJ = vtkImageSlice.newInstance();
const actorK = vtkImageSlice.newInstance();

const reader = vtkHttpDataSetReader.newInstance({
  fetchGzip: true,
});
reader
  .setUrl(`/headsq.vti`, { loadData: true })
  .then(() => {
      mouseinteractor(rendererI, actorI, mapperI);
      mouseinteractor(rendererJ, actorJ, mapperJ);
      mouseinteractor(rendererK, actorK, mapperK);
});

const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
renderWindow.addView(openglRenderWindow);
openglRenderWindow.setSize(400,400);

const container = document.createElement('div');
document.querySelector('body').appendChild(container);
openglRenderWindow.setContainer(container);

renderWindow.render();

function mouseinteractor(renderer, actor, mapper){
  const data = reader.getOutputData();  
  const range = data
    .getPointData()
    .getScalars()
    .getRange();

  mapper.setInputData(data);
  mapper.setSlicingMode(SlicingMode.K);
  actor.setMapper(mapper);

  renderWindow.addRenderer(renderer);
  renderer.addActor(actor);
  renderer.resetCamera();

  const wMin = 1;
  const wMax = range[1] - range[0];
  const wGet = actor.getProperty().getColorWindow;
  const wSet = actor.getProperty().setColorWindow;
  const lMin = range[0];
  const lMax = range[1];
  const lGet = actor.getProperty().getColorLevel;
  const lSet = actor.getProperty().setColorLevel;
  const extent = data.getExtent();
  const kMin = extent[4];
  const kMax = extent[5];
  const kGet = mapper.getSlice;
  const kSet = mapper.setSlice;
  const rangeManipulator = Manipulators.vtkMouseRangeManipulator.newInstance({
  button: 1,
  scrollEnabled: true,
  });
  rangeManipulator.setVerticalListener(wMin, wMax, 1, wGet, wSet);
  rangeManipulator.setHorizontalListener(lMin, lMax, 1, lGet, lSet);
  //rangeManipulator.setHorizontalListener(kMin, kMax, 1, kGet, kSet);
  rangeManipulator.setScrollListener(kMin, kMax, 1, kGet, kSet);

  const iStyle = vtkInteractorStyleManipulator.newInstance();
  iStyle.addMouseManipulator(rangeManipulator);
  const interactor = vtkRenderWindowInteractor.newInstance();
  interactor.setView(openglRenderWindow);
  interactor.initialize();
  interactor.bindEvents(container);
  interactor.setInteractorStyle(iStyle);
}


