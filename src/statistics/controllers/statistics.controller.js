const { NotFoundException,InternalServerException } = require("../../exceptions");
const statisticsService = require("../services/statistics.service");

const getDashboardStatistic = async (req, res) => {
  const { dashboardName } = req.params;
  try {
    const result = await statisticsService.runQuery(dashboardName);
    if (!result) {
      return res.status(404).json(new NotFoundException("Dashboard not found"));
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json(new InternalServerException("Internal Server Error"));
  }
};

module.exports = { getDashboardStatistic };
