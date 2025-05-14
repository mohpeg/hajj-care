const db = require("../../models");
const { NotFoundException, ValidationException } = require("../../exceptions");
const {
  pilgrimContactAuthSchema,
} = require("../../validation/ValidatePilgrimContactInformations.js");

const {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
} = require("../../constants/pagination.js");

function setPilgrimDTO(user) {
  return {
    hajjId: user.hajjId,
    username: user.username,
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    role: user.role,
    nationalId: user.nationalId,
    passportNumber: user.passportNumber,
    mobileNumber: user.mobileNumber,
    emergencyMobileNumber: user.emergencyMobileNumber,
    dateOfBirth: user.dateOfBirth,
    hotelName: user.hotelName,
    roomNumber: user.roomNumber,
    passportImage: user.passportImage,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function findPilgrim(hajjId) {
  const pilgrimRecord = await db.UserAccount.findOne({
    where: {
      hajjId,
    },
  });
  if (!pilgrimRecord) {
    return res.status(404).json(new NotFoundException("Pilgrim not found"));
  }
  return pilgrimRecord;
}

async function savePilgrimContactInfo(hajjId, data) {
  const { error } = pilgrimContactAuthSchema.validate(data, {
    abortEarly: false,
  });
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(", ");
    throw new ValidationException(`Validation error: ${errorMessage}`);
  }

  const pilgrimRecord = await db.UserAccount.findOne({
    where: { hajjId },
  });
  if (!pilgrimRecord) {
    const newPilgrimRecord = await db.UserAccount.create({
      ...data,
      hajjId,
    });
    return newPilgrimRecord;
  }
  if (pilgrimRecord) {
    await db.UserAccount.update({ ...data }, { where: { hajjId } });

    const updatedRecord = await db.UserAccount.findOne({
      where: { hajjId },
    });
    return updatedRecord;
  }
}
async function getPaginatedData(
  pageIndex = DEFAULT_PAGE_INDEX,
  pageSize = DEFAULT_PAGE_SIZE,
  order = DEFAULT_SORT_DIRECTION
) {
  const offset = (pageIndex - 1) * pageSize;
  const { count, rows } = await db.UserAccount.findAndCountAll({
    limit: pageSize,
    offset,
    order: [["createdAt", order]],
    include: [
      {
        model: db.MedicalRecord,
        as: "medicalRecords",
        required: false,
      },
    ],
  });

  const data = rows.map((row) => {
    return {
      ...setPilgrimDTO(row.toJSON()),
      medicalRecords:
        row.medicalRecords != null ? row.medicalRecords.toJSON() : null,
    };
  });
  return {
    currentPage: pageIndex,
    totalPages: Math.ceil(count / pageSize),
    totalRecords: count,
    data,
  };
}
module.exports = {
  findPilgrim,
  setPilgrimDTO,
  savePilgrimContactInfo,
  getPaginatedData,
};
