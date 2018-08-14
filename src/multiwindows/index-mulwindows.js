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

import controlPanel from './controlPanel.html';

const renderWindow1 = vtkRenderWindow.newInstance();
const renderWindow2 = vtkRenderWindow.newInstance();
const renderWindow3 = vtkRenderWindow.newInstance();

const renderer1 = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
const renderer2 = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
const renderer3 = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });

const imageActorI = vtkImageSlice.newInstance();
const imageActorJ = vtkImageSlice.newInstance();
const imageActorK = vtkImageSlice.newInstance();

const imageMapperI = vtkImageMapper.newInstance();
const imageMapperJ = vtkImageMapper.newInstance();
const imageMapperK = vtkImageMapper.newInstance();

// imageMapperI.setSlicingMode(SlicingMode.I);
// imageMapperJ.setSlicingMode(SlicingMode.J);
// imageMapperK.setSlicingMode(SlicingMode.K);

const { SlicingMode } = vtkImageMapper;


const reader = vtkHttpDataSetReader.newInstance({
    fetchGzip: true,
});
reader
    .setUrl(`/headsq.vti`, { loadData: true })
    .then(() => {
        piplineconnect(imageMapperI,imageActorI,renderer1,renderWindow1);
        piplineconnect(imageMapperJ,imageActorJ,renderer2,renderWindow2);
        piplineconnect(imageMapperK,imageActorK,renderer3,renderWindow3);

    });

global.source = reader;
global.mapper = imageMapperK;
global.actor = imageActorK;
global.renderer = renderer3;
global.renderWindow = renderWindow3;

function piplineconnect(imageMapper, imageActor,renderer,renderWindow){
    const data = reader.getOutputData();
    const range = data
        .getPointData()
        .getScalars()
        .getRange();
    const extent = data.getExtent();
    console.log(extent);

    imageMapper.setInputData(data);
    imageActor.setMapper(imageMapper);
    imageMapper.setSlicingMode(SlicingMode.K);
    renderWindow.addRenderer(renderer);
    renderer.addActor(imageActor);
    renderer.resetCamera();
    renderWindow.render();

    const wMin = 1;
    const wMax = range[1] - range[0];
    const wGet = imageActor.getProperty().getColorWindow;
    const wSet = imageActor.getProperty().setColorWindow;
    const lMin = range[0];
    const lMax = range[1];
    const lGet = imageActor.getProperty().getColorLevel;
    const lSet = imageActor.getProperty().setColorLevel;
    
    const kMin = extent[4];
    const kMax = extent[5];
    const kGet = imageMapper.getSlice;
    const kSet = imageMapper.setSlice;
    const rangeManipulator = Manipulators.vtkMouseRangeManipulator.newInstance({
    button: 1,
    scrollEnabled: true,
    });
    rangeManipulator.setVerticalListener(wMin, wMax, 1, wGet, wSet);
    rangeManipulator.setHorizontalListener(lMin, lMax, 1, lGet, lSet);
    rangeManipulator.setScrollListener(kMin, kMax, 1, kGet, kSet);

    console.log(kSet);
    console.log(kGet);

    const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
    renderWindow.addView(openglRenderWindow);

    const container = document.createElement('div');
    document.querySelector('body').appendChild(container);
    openglRenderWindow.setContainer(container);

    const iStyle = vtkInteractorStyleManipulator.newInstance();
    iStyle.addMouseManipulator(rangeManipulator);
    const interactor = vtkRenderWindowInteractor.newInstance();
    interactor.setView(openglRenderWindow);
    interactor.initialize();
    interactor.bindEvents(container);
    interactor.setInteractorStyle(iStyle);

    // const interactor = vtkRenderWindowInteractor.newInstance();
    // interactor.setView(openglRenderWindow);
    // interactor.initialize();
    // interactor.bindEvents(container);
}






