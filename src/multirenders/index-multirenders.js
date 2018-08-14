// import 'vtk.js/Sources/favicon';

// import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
// import vtkHttpDataSetReader from 'vtk.js/Sources/IO/Core/HttpDataSetReader';
// import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
// import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';

// import controlPanel from './controlPanel.html';

// const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
//   background: [0, 0, 0],
// });
// const renderWindow = fullScreenRenderWindow.getRenderWindow();
// const renderer = fullScreenRenderWindow.getRenderer();
// fullScreenRenderWindow.addController(controlPanel);

// const imageActorI = vtkImageSlice.newInstance();

// renderer.addActor(imageActorI);

// const reader = vtkHttpDataSetReader.newInstance({
//   fetchGzip: true,
// });
// const { SlicingMode } = vtkImageMapper;
// reader
//   .setUrl(`/headsq.vti`, { loadData: true })
//   .then(() => {
//     const data = reader.getOutputData();
//     const dataRange = data
//       .getPointData()
//       .getScalars()
//       .getRange();
//     const extent = data.getExtent();

//     const imageMapperI = vtkImageMapper.newInstance();
//     imageMapperI.setInputData(data);
//     imageMapperI.setISlice(30);

//     imageActorI.setMapper(imageMapperI);

//     renderer.resetCamera();
//     renderer.resetCameraClippingRange();
//     renderWindow.render();

//     ['.sliceI'].forEach((selector, idx) => {
//       const el = document.querySelector(selector);
//       el.setAttribute('min', extent[idx * 2 + 0]);
//       el.setAttribute('mquerySelectorax', extent[idx * 2 + 1]);
//       el.setAttribute('vquerySelectoralue', 30);
//     });querySelector
// querySelector
//   });querySelector
// querySelector
// document.querySelector('querySelector.sliceI').addEventListener('input', (e) => {
//   imageActorI.getMapper(querySelector).setISlice(Number(e.target.value));
//   renderWindow.render();querySelector
// });querySelector
// querySelector
// querySelector
// querySelector
// global.fullScreen = fullquerySelectorScreenRenderWindow;
// global.imageActorI = imaquerySelectorgeActorI;

//////////////////////////////////////////////////////////////////

// import 'vtk.js/Sources/favicon';

// import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
// import vtkHttpDataSetReader from 'vtk.js/Sources/IO/Core/HttpDataSetReader';
// import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
// import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';

// import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
// import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
// import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
// import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';

// import controlPanel from './controlPanel.html';

// const renderWindow = vtkRenderWindow.newInstance();

// const renderer = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });

// renderWindow.addRenderer(renderer);


// const imageActorI = vtkImageSlice.newInstance();


// renderer.addActor(imageActorI);

// const reader = vtkHttpDataSetReader.newInstance({
//     fetchGzip: true,
// });
// reader
//     .setUrl(`/headsq.vti`, { loadData: true })
//     .then(() => {
//         const data = reader.getOutputData();
//         const range = data
//             .getPointData()
//             .getScalars()
//             .getRange();
//             const extent = data.getExtent();

//             const imageMapperI = vtkImageMapper.newInstance();
//             imageMapperI.setInputData(data);
//             imageMapperI.setISlice(30);
            
//             const { SlicingMode } = vtkImageMapper;
//             imageMapperI.setSlicingMode(SlicingMode.K);
            
//             imageActorI.setMapper(imageMapperI);
            
//             const wMin = 1;
//             const wMax = range[1] - range[0];
//             const wGet = imageMapperI.getProperty().getColorWindow;
//             const wSet = imageMapperI.getProperty().setColorWindow;
//             const lMin = range[0];
//             const lMax = range[1];
//             const lGet = imageMapperI.getProperty().getColorLevel;
//             const lSet = imageMapperI.getProperty().setColorLevel;
//             //const extent = data.getExtent();
//             const kMin = extent[4];
//             const kMax = extent[5];
//             const kGet = mapper.getSlice;
//             const kSet = mapper.setSlice;
            
//             const rangeManipulator = Manipulators.vtkMouseRangeManipulator.newInstance({
//               button: 1,
//               scrollEnabled: true,
//             });
//             rangeManipulator.setVerticalListener(wMin, wMax, 1, wGet, wSet);
//             rangeManipulator.setHorizontalListener(lMin, lMax, 1, lGet, lSet);
//             rangeManipulator.setScrollListener(kMin, kMax, 1, kGet, kSet);
            
//             const iStyle = vtkInteractorStyleManipulator.newInstance();
//             iStyle.addMouseManipulator(rangeManipulator);
//             renderWindow.getInteractor().setInteractorStyle(iStyle);
            
//             renderer.getActiveCamera().setParallelProjection(true);
//             renderer.addActor(imageMapperI);
//             renderer.resetCamera();
//             renderWindow.render();
//           });



// // renderer.resetCamera();
// // renderer.resetCameraClippingRange();
// // renderWindow.render();
    

// const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
// renderWindow.addView(openglRenderWindow);

// const container = document.createElement('div');
// document.querySelector('body').appendChild(container);
// openglRenderWindow.setContainer(container);

// // const interactor = vtkRenderWindowInteractor.newInstance();
// // interactor.setView(openglRenderWindow);
// // interactor.initialize();
// // interactor.bindEvents(container);

// //global.fullScreen = fullScreenRenderWindow;
// //global.imageActorI = imageActorI;
// //global.imageActorJ = imageActorJ;
// //global.imageActorK = imageActorK;

////////////////////////////////

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





// -----------------------------------------------------------
// Make some variables global so that you can inspect and
// modify objects in your browser's developer console:
// -----------------------------------------------------------

//global.source = rtSource;
// global.source = reader;
// global.mapper = mapper;
// global.actor = actor;
// global.renderer = renderer;
// global.renderWindow = renderWindow;


///////////////////////////////////////////////
// import 'vtk.js/Sources/favicon';

// import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
// import vtkHttpDataSetReader from 'vtk.js/Sources/IO/Core/HttpDataSetReader';
// import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
// import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';

// // import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
// // import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
// import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
// //import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';



// import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
// import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
// import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
// import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
// import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
// import vtkConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource';
// import vtkSphereSource from 'vtk.js/Sources/Filters/Sources/SphereSource';
// import vtkCubeSource from 'vtk.js/Sources/Filters/Sources/CubeSource';


// const container = document.querySelector('body');
// const renderWindowContainer = document.createElement('div');
// container.appendChild(renderWindowContainer);

// const renderWindow = vtkRenderWindow.newInstance();

// const upperRenderer = vtkRenderer.newInstance();
//   upperRenderer.setViewport(0, 0.5, 1, 1); // xmin, ymin, xmax, ymax
//   renderWindow.addRenderer(upperRenderer);
//   upperRenderer.setBackground(0.32, 0.34, 0.43);

//   const coneActor = gvtkActor.newInstance();
//   upperRenderer.addActor(coneActor);

//   const coneMapper = vtkMapper.newInstance();
//   coneActor.setMapper(coneMapper);

//   const coneSource = vtkConeSource.newInstance({ height: 1.0 });
//   coneMapper.setInputConnection(coneSource.getOutputPort());

//   // Lower left renderer
//   const lowerLeftRenderer = vtkRenderer.newInstance();
//   lowerLeftRenderer.setViewport(0, 0, 0.5, 0.5); // xmin, ymin, xmax, ymax
//   renderWindow.addRenderer(lowerLeftRenderer);
//   lowerLeftRenderer.setBackground(0, 0.5, 0);

//   const sphereActor = vtkActor.newInstance();
//   lowerLeftRenderer.addActor(sphereActor);

//   const sphereMapper = vtkMapper.newInstance();
//   sphereActor.setMapper(sphereMapper);

//   const sphereSource = vtkSphereSource.newInstance();
//   sphereMapper.setInputConnection(sphereSource.getOutputPort());

//   // Lower right renderer
//   const lowerRightRenderer = vtkRenderer.newInstance();
//   lowerRightRenderer.setViewport(0.5, 0, 1, 0.5); // xmin, ymin, xmax, ymax
//   renderWindow.addRenderer(lowerRightRenderer);
//   lowerRightRenderer.setBackground(0, 0, 0.5);

//   const cubeActor = vtkActor.newInstance();
//   lowerRightRenderer.addActor(cubeActor);

//   const cubeMapper = vtkMapper.newInstance();
//   cubeActor.setMapper(cubeMapper);

//   const cubeSource = vtkCubeSource.newInstance();
//   cubeMapper.setInputConnection(cubeSource.getOutputPort());

//   const glwindow = vtkOpenGLRenderWindow.newInstance();

//   glwindow.setContainer(renderWindowContainer);
//   renderWindow.addView(glwindow);
//   glwindow.setSize(400, 400);

//   upperRenderer.resetCamera();
//   lowerLeftRenderer.resetCamera();
//   lowerRightRenderer.resetCamera();

//   renderWindow.render();
