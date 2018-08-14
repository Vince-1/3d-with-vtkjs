import 'vtk.js/Sources/favicon';

import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkHttpDataSetReader from 'vtk.js/Sources/IO/Core/HttpDataSetReader';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';

import controlPanel from './controlPanel.html';

const fullScreenRenderWindow = vtkFullScreenRenderWindow.newInstance({
  background: [0, 0, 0],
});
const renderWindow = fullScreenRenderWindow.getRenderWindow();
const renderer = fullScreenRenderWindow.getRenderer();
fullScreenRenderWindow.addController(controlPanel);

const imageActorI = vtkImageSlice.newInstance();

renderer.addActor(imageActorI);

const reader = vtkHttpDataSetReader.newInstance({
  fetchGzip: true,
});
const { SlicingMode } = vtkImageMapper;
reader
  .setUrl(`/headsq.vti`, { loadData: true })
  .then(() => {
    const data = reader.getOutputData();
    const dataRange = data
      .getPointData()
      .getScalars()
      .getRange();
    const extent = data.getExtent();

    const imageMapperI = vtkImageMapper.newInstance();
    imageMapperI.setInputData(data);
    imageMapperI.setISlice(30);

    imageActorI.setMapper(imageMapperI);

    renderer.resetCamera();
    renderer.resetCameraClippingRange();
    renderWindow.render();

    ['.sliceI'].forEach((selector, idx) => {
      const el = document.querySelector(selector);
      el.setAttribute('min', extent[idx * 2 + 0]);
      el.setAttribute('mquerySelectorax', extent[idx * 2 + 1]);
      el.setAttribute('vquerySelectoralue', 30);
    });querySelector
querySelector
  });querySelector
querySelector
document.querySelector('querySelector.sliceI').addEventListener('input', (e) => {
  imageActorI.getMapper(querySelector).setISlice(Number(e.target.value));
  renderWindow.render();querySelector
});querySelector
querySelector
querySelector
querySelector
global.fullScreen = fullquerySelectorScreenRenderWindow;
global.imageActorI = imaquerySelectorgeActorI;
