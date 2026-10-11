const Episode = require("../models/episode");

exports.getEpisodes = async (req, res, next) => {
    try {
        
        const { search, sort, inStock} =req.query;
        const page= Number(req.query.page) || 1;
        const limit= Number(req.query.limit) || 5;
        const filter={};
        if(search){
            filter.name={
                $regex:search,$options:"i"
            };
        }
        const total=await Episode.countDocuments(filter);
        const episodes=(await Episode.find(filter).limit(limit).skip((page-1)*limit)).sort(sort || "-createdAt");
        res.json({
            total,
            page,
            pages:Math.ceil(total/limit),
            results,
        });
    } catch (err) {
        next(err);
    }
}

exports.getEpisodeById = async (req, res, next) => {
    try {
        const episode = await Episode.findById(req.params.id);
        if (!episode) {
            return res.status(404).json({ message: "Episode not found" });
        }
        res.status(200).json(episode);
    } catch (err) {
        next(err);
    }
}

exports.createEpisode = async (req, res, next) => {
    try {
        const { title, duration } = req.body;
        if(!title){
            return res.status(400).json({
                message: "Title is required"
            });
        }
        if(!duration){
            return res.status(400).json({
                message: "Duration is required"
            });
        }
        const epi=await Episode.create({...req.body,createdBy:req.user.id});
        res.status(201).json(epi);
    }catch(err){
        next(err);
    }
}

exports.updateEpisode = async (req, res,next) => {
    try {
        const id = req.params.id;
        const episode=await Episode.findById(id);
        if(!episode){
            return res.status(404).json({
                message:"Episode not found"
            });
        }
        if(String(episode.createdBy) !== req.user.id){
            return res.status(403).json({
                message:"You are not the owner of this episode"
            });
        }
        delete req.body.createdBy;
        const updated = await Episode.findByIdAndUpdate(id, req.body, {
            returnDocument: "after", runValidators: true
        });

        res.status(200).json(updated);
    } catch(err) {
        next(err);
    }
}

exports.deleteEpisode = async (req, res,next) => {
    try{
        const id = req.params.id;
        const episode=await Episode.findById(id);
        if(!episode){
            return res.status(404).json({
                message:"Episode not found"
            });
        }
        if(String(episode.createdBy) !== req.user.id){
            return res.status(403).json({
                message:"You are not the owner of this episode"
            });
        }
        
        const deleted = await Episode.findByIdAndDelete(id);

        if(!episode) {
            return res.status(404).json({
                message: "Episode not found"
            });
        }

        res.status(200).json({
            message: "Episode deleted successfully"
        })
    }
    catch(err) {
        next(err);
    }
}

exports.getMyEpisodes=async (req,res,next)=>{
    try{
        const epiosodes=await Episode.find({
            createdBy:req.user.id
        });
        res.status(200).json(epiosodes);
    }catch(err){
        next(err);
    }
}
exports.getUnlistened=async (req,res,next)=>{
    try{
        const episode=await Episode.find({
            listened:false
        });
        res.status(200).json(episode);
    }
    catch(err){
        next(err);
    }
}