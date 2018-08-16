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

import controlPanel from './controlPanel.html';

//const init = Init();
// const coronal = init();
// const sagittal = init();
// const transverse = init();

const coronal = new Init();
const sagittal = new Init();
const transverse = new Init();

coronal.imageMapper.setISlice(30);
coronal.camera.setViewUp(0,0,1);
coronal.camera.setPosition(1,0,0);

sagittal.imageMapper.setJSlice(30);
sagittal.camera.setViewUp(0,0,1);
sagittal.camera.setPosition(0,1,0);

transverse.imageMapper.setKSlice(30);
transverse.camera.setViewUp(0,1,0);
transverse.camera.setPosition(0,0,1);


const reader = vtkHttpDataSetReader.newInstance({
    fetchGzip: true,
});

reader
    .setUrl(`/headsq.vti`, { loadData: true })
    .then(() => {
        piplineconnect(coronal.imageMapper,coronal.imageActor,coronal.renderer,coronal.renderWindow,coronal.camera,"C");
        piplineconnect(sagittal.imageMapper,sagittal.imageActor,sagittal.renderer,sagittal.renderWindow,sagittal.camera,"S");
        piplineconnect(transverse.imageMapper,transverse.imageActor,transverse.renderer,transverse.renderWindow,transverse.camera,"T");
        // piplineconnect(coronal);
        // piplineconnect(sagittal);
        // piplineconnect(transverse);
    });


function Init(){
    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance();
    const imageMapper = vtkImageMapper.newInstance();
    const imageActor = vtkImageSlice.newInstance();
    const camera = vtkCamera.newInstance();

    this.renderWindow = renderWindow;
    this.renderer = renderer;
    this.imageMapper = imageMapper;
    this.imageActor = imageActor;
    this.camera = camera;   
}

function piplineconnect(imageMapper, imageActor, renderer, renderWindow, camera, CID){
// function piplineconnect(plane){

//     imageMapper = plane.imageMapper;
//     imageActor = plane.imageActor;
//     renderer = plane.renderer;
//     renderWindow = plane.renderWindow;
//     camera = plane.camera;

    const data = reader.getOutputData();
    const range = data
        .getPointData()
        .getScalars()
        .getRange();
    const extent = data.getExtent();
    console.log(extent);

    imageMapper.setInputData(data);
    
    imageActor.setMapper(imageMapper);
    renderWindow.addRenderer(renderer);
    camera.setParallelProjection(true);
    renderer.setActiveCamera(camera);
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

    // const container = document.createElement('div');
    // document.querySelector('body').appendChild(container);

    const container = document.getElementById(CID)
    openglRenderWindow.setContainer(container);

    const iStyle = vtkInteractorStyleManipulator.newInstance();
    iStyle.addMouseManipulator(rangeManipulator);
    const interactor = vtkRenderWindowInteractor.newInstance();
    interactor.setView(openglRenderWindow);
    interactor.initialize();
    interactor.bindEvents(container);
    interactor.setInteractorStyle(iStyle);
}







