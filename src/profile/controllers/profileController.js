const pilgrimProfileServices = require('../services/profileService.js');
const {
  UnauthorizedException,
  NotFoundException,
} = require('../../exceptions');

async function getPilgrimProfile(req, res) {
  const { user } = req;
  if (!user) {
    return res.status(401).json(new UnauthorizedException('Not authorized'));
  }

  const pilgrimContactInfo = await pilgrimProfileServices.findPilgrim(
    user.hajjId
  );

  if (!pilgrimContactInfo) {
    return res.status(404).json(new NotFoundException('Pilgrim not found'));
  }

  return res.status(200).json({
    status: 'success',
    data: pilgrimProfileServices.setPilgrimDTO(pilgrimContactInfo),
  });
}

async function addPilgrimContactInfo(req, res) {
  const { user } = req;
  if (!user) {
    return res.status(401).json(new UnauthorizedException('Not authorized'));
  }

  let data = req.body;

  if (req.file) {
    data.passportImage = req.file.path;
  }

  const newPilgrimContactInfoRecord =
    await pilgrimProfileServices.savePilgrimContactInfo(user.hajjId, data);

  return res.status(201).json({
    status: 'success',
    operation: 'created',
    data: newPilgrimContactInfoRecord,
  });
}

async function updatePilgrimContactInfo(req, res) {
  const { user } = req;
  if (!user) {
    return res.status(401).json(new UnauthorizedException('Not authorized'));
  }

  let data = req.body;

  if (req.file) {
    data.passportImage = req.file.path;
  }

  const updatedPilgrimContactInfoRecord =
    await pilgrimProfileServices.savePilgrimContactInfo(user.hajjId, data);

  return res.status(200).json({
    status: 'success',
    operation: 'updated',
    data: updatedPilgrimContactInfoRecord,
  });
}

async function getAllPilgrimProfiles(req, res) {
  const { pageIndex, pageSize, order } = req.query;
  const result = await pilgrimProfileServices.getPaginatedData(
    pageIndex,
    pageSize,
    order
  );
  res.status(200).json(result);
}

module.exports = {
  getPilgrimProfile,
  addPilgrimContactInfo,
  updatePilgrimContactInfo,
  getAllPilgrimProfiles
};
