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

import vtkLine from 'vtk.js/Sources/Common/DataModel/Line';
import vtkPoints from 'vtk.js/Sources/Common/Core/Points';

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

const lineActor1 =  vtkActor.newInstance();
const lineActor2 =  vtkActor.newInstance();
const lineActor3 =  vtkActor.newInstance();

const reader = vtkHttpDataSetReader.newInstance({
    fetchGzip: true,
});

reader
    .setUrl(`/headsq.vti`, { loadData: true })
    .then(() => {
        piplineconnect(coronal.imageMapper,coronal.imageActor,coronal.renderer,coronal.renderWindow,coronal.camera,"C");
        piplineconnect(sagittal.imageMapper,sagittal.imageActor,sagittal.renderer,sagittal.renderWindow,sagittal.camera,"S");
        piplineconnect(transverse.imageMapper,transverse.imageActor,transverse.renderer,transverse.renderWindow,transverse.camera,"T");
        // piplineconnect(coronal,"C");
        // piplineconnect(sagittal,"S");
        // piplineconnect(transverse,"T");
    });


function Init(){
    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
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
    const xMax = bounds[1];
    const yMax = bounds[3];
    const zMax = bounds[5];

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

            // const sphere = vtkSphereSource.newInstance();
            // sphere.setCenter(pickedPoints[0]);
            // sphere.setRadius(50);
            // const sphereMapper = vtkMapper.newInstance();
            // sphereMapper.setInputData(sphere.getOutputData());
            // const sphereActor = vtkActor.newInstance();
            // sphereActor.setMapper(sphereMapper);
            // sphereActor.getProperty().setColor(0.0, 1.0, 1.0);
            // renderer.addActor(sphereActor);
            // renderWindow.render();
        
            // var linepoints = [
            //     [pickedPoints[0][0], 0, pickedPoints[0][2]],
            //     [pickedPoints[0][0], yMax, pickedPoints[0][2]],
            //     [0, pickedPoints[0],[1], pickedPoints[0],[2]],
            //     [xMax, pickedPoints[0],[1], pickedPoints[0][2]],
            //     [pickedPoints[0][0], pickedPoints[0][1], 0],
            //     [pickedPoints[0][0], pickedPoints[0],[1], zMax]
            // ];

            // const points = vtkPoints.newInstance();
            // points.setNumberOfPoints(3);
            // points.setData([
            //     pickedPoints[0][0], 0, pickedPoints[0][2],
            //     pickedPoints[0][0], yMax, pickedPoints[0][2],
            //     0, pickedPoints[0],[1], pickedPoints[0],[2],
            //     xMax, pickedPoints[0],[1], pickedPoints[0][2],
            //     pickedPoints[0][0], pickedPoints[0][1], 0,
            //     pickedPoints[0][0], pickedPoints[0],[1], zMax
            // ]);

            // const pointIdList = [0, 1, 2, 3, 4, 5];
            // const line = vtkLine.newInstance();
            // line.initialize(points.getNumberOfPoints(), pointIdList, points);

            // console.log('line',line);


            line3([pickedPoints[0][0], 0, pickedPoints[0][2]],
                [pickedPoints[0][0], yMax, pickedPoints[0][2]],lineActor1);

            line3([0, pickedPoints[0][1], pickedPoints[0][2]],
                [xMax-1, pickedPoints[0][1], pickedPoints[0][2]],lineActor2);

            line3([pickedPoints[0][0], pickedPoints[0][1], 0],
                [pickedPoints[0][0], pickedPoints[0][1], zMax],lineActor3);

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

global.coronal = coronal;