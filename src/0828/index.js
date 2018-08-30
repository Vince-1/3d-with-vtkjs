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

import vtkOpenGLVolume from 'vtk.js/Sources/Rendering/OpenGL/Volume';
import vtkOpenGLVolumeMapper from 'vtk.js/Sources/Rendering/OpenGL/VolumeMapper';

import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';



import vtkLine from 'vtk.js/Sources/Common/DataModel/Line';
import vtkPoints from 'vtk.js/Sources/Common/Core/Points';

import controlPanel from './controlPanel.html';

//const init = Init();
// const coronal = init();
// const sagittal = init();
// const transverse = init();

// const coronal = new Init();
// const sagittal = new Init();
// const transverse = new Init();

const coronal = Init();
const sagittal = Init();
const transverse = Init();

var cid = ["C","S","T","V"];

const { SlicingMode } = vtkImageMapper;

cameraSet(SlicingMode.I,coronal.imageMapper,coronal.camera,30,[0,0,1],[1,0,0]);
cameraSet(SlicingMode.J,sagittal.imageMapper,sagittal.camera,30,[0,0,1],[0,1,0]);
cameraSet(SlicingMode.K,transverse.imageMapper,sagittal.camera,30,[0,1,0],[0,0,1]);

function cameraSet(mode,mapper,camera,slice,viewUp,position){
    mapper.setSlicingMode(mode);
    mapper.setSlice(slice);
    camera.setViewUp(viewUp);
    camera.setPosition(position);
}



coronal.imageMapper.setISlice(30);
coronal.camera.setViewUp(0,0,1);
coronal.camera.setPosition(1,0,0);

sagittal.imageMapper.setJSlice(30);
sagittal.camera.setViewUp(0,0,1);
sagittal.camera.setPosition(0,1,0);

transverse.imageMapper.setKSlice(30);
transverse.camera.setViewUp(0,1,0);
transverse.camera.setPosition(0,0,1);

const lineActor1 =  vtkActor.newInstance();
const lineActor2 =  vtkActor.newInstance();
const lineActor3 =  vtkActor.newInstance();

const reader = vtkHttpDataSetReader.newInstance({
    fetchGzip: true,
});

reader
    .setUrl(`/headsq.vti`, { loadData: true })
    .then(() => {
        piplineconnect(
            coronal.imageMapper,
            coronal.imageActor,
            coronal.renderer,
            coronal.renderWindow,
            coronal.camera,cid[0]);
        piplineconnect(
            sagittal.imageMapper,
            sagittal.imageActor,
            sagittal.renderer,
            sagittal.renderWindow,
            sagittal.camera,cid[1]);
        piplineconnect(
            transverse.imageMapper,
            transverse.imageActor,
            transverse.renderer,
            transverse.renderWindow,
            transverse.camera,cid[2]);
        
    });

const vol = vtkVolume.newInstance();
const volMapper = vtkVolumeMapper.newInstance();

// const vol = vtkOpenGLVolume.newInstance();
// const volMapper = vtkOpenGLVolumeMapper.newInstance();

// const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
//     background: [0, 0, 0],
//   });
// const volRenderer = fullScreenRenderer.getRenderer();
// const volRenderWindow = fullScreenRenderer.getRenderWindow();

const volRenderer = vtkRenderer.newInstance();
const volRenderWindow = vtkRenderWindow.newInstance();

volumeRendering();


function Init(){
    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
    const imageMapper = vtkImageMapper.newInstance();
    //const imageMapper = vtkVolumeMapper.newInstance();
    const imageActor = vtkImageSlice.newInstance();
    const camera = vtkCamera.newInstance();

    return {
        renderWindow:renderWindow,
        renderer:renderer,
        imageMapper:imageMapper,
        imageActor:imageActor,
        camera:camera
    }


}

function piplineconnect(imageMapper, imageActor, renderer, renderWindow, camera, cID){
// function piplineconnect(p:plane,CID){

    // imageMapper = plane.imageMapper;
    // imageActor = plane.imageActor;
    // renderer = plane.renderer;
    // renderWindow = plane.renderWindow;
    // camera = plane.camera;

    const data = reader.getOutputData();
    console.log('data',data);
    const range = data
        .getPointData()
        .getScalars()
        .getRange();
    const extent = data.getExtent();
    console.log(data);
    console.log(extent);
    console.log(range);

    imageMapper.setInputData(data);
    
    imageActor.setMapper(imageMapper);
    renderWindow.addRenderer(renderer);
    camera.setParallelProjection(true);
    renderer.setActiveCamera(camera);
    renderer.addActor(imageActor);
    renderer.resetCamera();
    renderWindow.render();

    const bounds = imageActor.getBounds();

    const rangeManipulator = Manipulators.vtkMouseRangeManipulator.newInstance({
    button: 1,
    scrollEnabled: true,
    });
    rangeManipulator.setVerticalListener(1, range[1] - range[0], 1, imageActor.getProperty().getColorWindow,imageActor.getProperty().setColorWindow);
    rangeManipulator.setHorizontalListener(range[0], range[1], 1, imageActor.getProperty().getColorLevel, imageActor.getProperty().setColorLevel);
    rangeManipulator.setScrollListener(extent[4], extent[5], 1, imageMapper.getSlice, imageMapper.setSlice);

    const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
    renderWindow.addView(openglRenderWindow);

    const container = document.getElementById(cID)
    openglRenderWindow.setContainer(container);

    const iStyle = vtkInteractorStyleManipulator.newInstance();
    iStyle.addMouseManipulator(rangeManipulator);
    const interactor = vtkRenderWindowInteractor.newInstance();
    interactor.setView(openglRenderWindow);
    interactor.initialize();
    interactor.bindEvents(container);
    interactor.setInteractorStyle(iStyle);

    const picker = vtkPointPicker.newInstance();
    picker.setPickFromList(1);
    picker.initializePickList();
    picker.addPickList(imageActor);
    renderWindow.getInteractor().onRightButtonPress((callData) => {
        if (renderer !== callData.pokedRenderer) {
          return;
        }
      
        const pos = callData.position;
        const point = [pos.x, pos.y, 0.0];
        console.log(`Pick at: ${point}`);
        picker.pick(point, renderer);
      
        if (picker.getActors().length === 0) {
          const pickedPoint = picker.getPickPosition();
          console.log(`No point picked, default: ${pickedPoint}`);
          const sphere = vtkSphereSource.newInstance();
            sphere.setCenter(pickedPoint);
            sphere.setRadius(0.01);
            const sphereMapper = vtkMapper.newInstance();
            sphereMapper.setInputData(sphere.getOutputData());
            const sphereActor = vtkActor.newInstance();
            sphereActor.setMapper(sphereMapper);
            sphereActor.getProperty().setColor(0.0, 1.0, 1.0);
            renderer.addActor(sphereActor);
            renderWindow.render();
        } else {

            const pickedPointId = picker.getPointId();
            console.log('Picked point: ', pickedPointId);
        
            const pickedPoints = picker.getPickedPositions();
            console.log('Picked point: ', pickedPoints);
            
            console.log('bounds',bounds);

            var iSlice = parseInt(pickedPoints[0][0]/3.2);
            var jSlice = parseInt(pickedPoints[0][1]/3.2);
            var kSlice = parseInt(pickedPoints[0][2]/1.5);  

            console.log(iSlice,jSlice,kSlice);       

            coronal.imageMapper.setISlice(iSlice);
            coronal.renderWindow.render();
            sagittal.imageMapper.setJSlice(jSlice);
            sagittal.renderWindow.render();
            transverse.imageMapper.setKSlice(kSlice);
            transverse.renderWindow.render();


            line3([pickedPoints[0][0], 0, pickedPoints[0][2]],
                [pickedPoints[0][0], bounds[3], pickedPoints[0][2]],lineActor1);

            line3([0, pickedPoints[0][1], pickedPoints[0][2]],
                [bounds[1], pickedPoints[0][1], pickedPoints[0][2]],lineActor2);

            line3([pickedPoints[0][0], pickedPoints[0][1], 0],
                [pickedPoints[0][0], pickedPoints[0][1], bounds[5]],lineActor3);

            for (let i = 0; i < pickedPoints.length; i++) {
                const pickedPoint = pickedPoints[i];
                console.log(`Picked: ${pickedPoint}`);

            }
        }

      });
}

function line3(point1,point2,lineActor){
    const line = vtkLineSource.newInstance();
    //const lineActor =  vtkActor.newInstance();
    const lineMapper = vtkMapper.newInstance();
    line.setPoint1(point1);
    line.setPoint2(point2);
    lineActor.getProperty().setPointSize(10);

    lineMapper.setInputData(line.getOutputData());
    lineActor.setMapper(lineMapper);
    lineActor.getProperty().setColor(0.0, 1.0, 1.0);
    // renderer.addActor(lineActor);
    // renderWindow.render();
  
    coronal.renderer.addActor(lineActor);
    coronal.renderWindow.render();
    sagittal.renderer.addActor(lineActor);
    sagittal.renderWindow.render();
    transverse.renderer.addActor(lineActor);
    transverse.renderWindow.render();
}



function volumeRendering() {
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
    ofun.addPoint(200.0, 0.0);
    ofun.addPoint(1200.0, 0.2);
    ofun.addPoint(4000.0, 0.4);
  
    vol.getProperty().setRGBTransferFunction(0, ctfun);
    vol.getProperty().setScalarOpacity(0, ofun);
    vol.getProperty().setScalarOpacityUnitDistance(0, 4.5);
    vol.getProperty().setInterpolationTypeToFastLinear();
  
    volMapper.setInputConnection(volReader.getOutputPort());

    const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
    volRenderWindow.addView(openglRenderWindow);

    const container = document.getElementById("C")
    openglRenderWindow.setContainer(container);
}

global.coronal = coronal;