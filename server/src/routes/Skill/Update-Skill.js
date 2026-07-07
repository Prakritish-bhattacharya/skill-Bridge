const express = require("express");

const { userAuth } = require("../../middleware/userAuth");
const { validateSkillUpdate } = require("../../utils/validate-Skill-Update");

const UpdateSkillRouter = express.Router();

/**
 * ======================================
 * Update User Skill
 * PATCH /api/v1/users/me/skills/:skillId
 * ======================================
 */
UpdateSkillRouter.patch("/:skillId", userAuth, async (req, res) => {
  try {
    console.log("PATCH route hit");

    validateSkillUpdate(req);

    //=======================
    // Logged In User
    //=======================
    const loggedInUser = req.user;

    //======================
    // Extract SkillId
    //======================
    const { skillId } = req.params;
    console.log(skillId)

    //========================
    // Search Mongoose SubDocument Array using Mongoose helper
    // Find Skill by id
    //========================
    const skill = loggedInUser.skills.id(skillId)
    console.log(skill)

    //========================
    // Skill existsss ?????????
    //========================
    if(!skill){
        return res.status(404).json({
            success: false,
            message: "Skill not found !!!"
        })
    }
    //============================================
    // Main Business Rule===========>>>>
    // Learn ---> Teach  (valid)
    // Teach ---> Learn  (Prohibited)
    //============================================
    if(req.body.type){
        if(skill.type === "Teach" && req.body.type === "Learn"){
            return res.status(400).json({
                success: false,
                message: "You can't change a teaching skill back to learning skill !!!"
            })
        }
    }
    
    //====================================
    // LOOP through request body
    //====================================
    Object.keys(req.body).forEach((field)=>{
        skill[field] = req.body[field]
    })

    //======================
    // save the user
    //=====================
    await loggedInUser.save()

    return res.status(200).json({
      success: true,
      message: "Skill Updated Successfully..",
      skill
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = { UpdateSkillRouter };
